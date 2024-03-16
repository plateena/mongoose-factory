import { Model } from 'mongoose';
import BaseFactory, { FactoryError } from './../src/BaseFactory'

// Define a mock Mongoose model for testing purposes
interface MockModel<T> {
    create(data: T): Promise<T>;
    insertMany(data: T[]): Promise<T[]>;
}

// Mock implementation of Mongoose model
const mockModel: MockModel<any> = {
    async create(data) {
        return Promise.resolve(data);
    },
    async insertMany(data) {
        return Promise.resolve(data);
    }
};

// Mock subclass of BaseFactory for testing
class TestFactory extends BaseFactory<any> {
    async definition() {
        return Promise.resolve({}); // Mock definition for testing
    }
}

describe('BaseFactory', () => {
    let factory: TestFactory;

    beforeEach(() => {
        factory = new TestFactory(mockModel as unknown as Model<any>);
    });

    test('count method sets quantity', () => {
        factory.count(5);
        expect(factory['quantity']).toBe(5);
    });

    test('count method throws error for non-positive integer', () => {
        expect(() => factory.count(0)).toThrow(FactoryError);
        expect(() => factory.count(-1)).toThrow(FactoryError);
        expect(() => factory.count(1.5)).toThrow(FactoryError);
        expect(() => factory.count(NaN)).toThrow(FactoryError);
        expect(() => factory.count(Infinity)).toThrow(FactoryError);
    });

    test('withState method adds mutation', () => {
        const mutation = { name: 'John' };
        factory.withState(mutation);
        expect(factory['mutation']).toHaveLength(1);
        expect(factory['mutation'][0]()).toEqual(mutation);
    });

    test('withState method handles function mutation', () => {
        const mutationFn = () => ({ age: 30 });
        factory.withState(mutationFn);
        expect(factory['mutation']).toHaveLength(1);
        expect(factory['mutation'][0]()).toEqual({ age: 30 });
    });

    test('generate method generates instances', async () => {
        factory.count(2);
        await factory.generate();
        expect(factory['data']).toHaveLength(2);
    });

    test('make method generates instances without persistence', async () => {
        factory.count(2);
        const instances = await factory.make();
        expect(instances).toHaveLength(2);
        expect(factory['data']).toHaveLength(0); // Ensure data is cleared after make
    });

    test('create method creates instances using model', async () => {
        factory.count(2);
        const instances = await factory.create();
        expect(instances).toHaveLength(2);
    });

    test('create method handles errors during creation', async () => {
        const errorModel: MockModel<any> = {
            async create(data) {
                throw new Error('Creation error');
            },
            async insertMany(data) {
                throw new Error('Creation error');
            }
        };
        const errorFactory = new TestFactory(errorModel as unknown as Model<any>);
        await expect(errorFactory.create()).rejects.toThrow(FactoryError);
    });
});
