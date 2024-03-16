// Define a custom error type for more descriptive error messages
export class FactoryError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FactoryError';
    }
}

import { Model } from 'mongoose';

/**
 * BaseFactory class for generating and creating instances of Mongoose models.
 * @template T - Type of data to generate and create instances of.
 */
abstract class BaseFactory<T> {
    protected quantity: number = 1;
    protected data: T[] = [];
    protected model: Model<T>;
    private mutation: (() => Partial<T>)[] = [];

    /**
     * Defines the base structure of the data to be generated.
     * Subclasses must implement this method to provide the definition.
     * @abstract
     * @returns {Promise<T>} The base data structure.
     */
    abstract definition(): Promise<T>;

    /**
     * Constructs a new BaseFactory instance.
     * @param {Model<T>} model - The Mongoose model to use for creating instances.
     */
    constructor(model: Model<T>) {
        this.model = model;
    }

    /**
     * Sets the quantity of instances to generate.
     * @param {number} quantity - The quantity of instances to generate.
     * @returns {this} The current BaseFactory instance for method chaining.
     * @throws {FactoryError} If quantity is not a positive integer.
     */
    count(quantity: number): this {
        if (!Number.isInteger(quantity) || quantity < 1) {
            throw new FactoryError('Quantity must be a positive integer.');
        }
        this.quantity = quantity;
        return this;
    }

    /**
     * Adds state mutations to modify the generated data.
     * @param {Partial<T> | (() => Partial<T>)} state - The state mutation to apply.
     * @returns {this} The current BaseFactory instance for method chaining.
     */
    withState(state: Partial<T> | (() => Partial<T>)): this {
        if (state instanceof Function) {
            this.mutation.push(state);
        } else {
            this.mutation.push(() => state);
        }
        return this;
    }

    /**
     * Generates instances based on the defined quantity and mutations.
     */
    async generate(): Promise<void> {
        for (let i = 0; i < this.quantity; i++) {
            let newData: T = await this.definition();
            for (const mutation of this.mutation) {
                newData = { ...newData, ...mutation() };
            }
            this.data.push(newData);
        }
    }

    /**
     * Resets the factory's state after generating or creating instances.
     */
    private reset(): void {
        this.quantity = 1;
        this.data = [];
        this.mutation = [];
    }

    /**
     * Generates and returns the instances without persisting them.
     * @returns {Promise<T | T[]>} The generated instance or an array of instances.
     */
    async make(): Promise<T | T[]> {
        await this.generate();
        const result: T | T[] = this.quantity === 1 ? this.data[0] : this.data;
        this.reset();
        return result;
    }

    /**
     * Generates and creates instances using the Mongoose model.
     * @returns {Promise<T | T[]>} A promise resolving to the created instance or an array of instances.
     * @throws {FactoryError} If an error occurs during instance creation.
     */
    async create(): Promise<T | T[]> {
        await this.generate();
        let result: T | T[];
        try {
            if (this.quantity === 1) {
                result = await this.model.create(this.data[0]);
            } else {
                result = await this.model.insertMany(this.data);
            }
        } catch (error) {
            console.error('Error occurred during creation:', error);
            throw new FactoryError('Error occurred during creation. Check the console for details.');
        }
        this.reset();
        return result;
    }
}

export default BaseFactory;
