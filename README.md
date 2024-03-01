# @zainundin/mongoose-factory

@zainundin/mongoose-factory is a utility for generating and creating instances of Mongoose models with ease.

## Installation

You can install @zainundin/mongoose-factory via npm:

```bash
npm install @zainundin/mongoose-factory
```

## Usage

To use @zainundin/mongoose-factory, you need to create a subclass of the `BaseFactory` class and implement the `definition()` method to define the structure of the data you want to generate.

### Example Usage with Faker

Here's an example of how to use @zainundin/mongoose-factory with Faker for generating fake data and applying state mutations with the `withState()` method:

```javascript
import { Model } from 'mongoose';
import BaseFactory from '@zainundin/mongoose-factory';
import { faker } from '@faker-js/faker';

// Define your Mongoose model
const YourModel = Model(/* Your Mongoose model schema */);

// Create a subclass of BaseFactory for your model
class YourModelFactory extends BaseFactory {
    constructor() {
        super(YourModel);
    }

    // Implement the abstract definition method
    definition() {
        // Define the structure of your data here
        return {
            name: faker.person.fullname(),
            email: faker.internet.email(),
            age: faker.number.int({max: 120, min: 10}),
            status: faker.helpers.enumValue({'active', 'inactive'}),
            isAdmin: faker.datatype.boolean(),
            createdAt: faker.date.recent()
        };
    }

    // Add a new method to apply state mutations
    isAdmin() {
        this.withState({isAdmin: true})
        return this
    }
}

// Create an instance of YourModelFactory
const yourModelFactory = new YourModelFactory();

```

### Generate a Single Instance of Your Model

You can generate a single instance of your model without any mutations:

```javascript
// Generate a single instance of your model
const instance = yourModelFactory.make();
console.log(instance); // Output: The generated instance of your model
```

### Generate Instances of Your Model with Count

You can generate multiple instances of your model with the specified count:

```javascript
// Generate multiple instances of your model with count
const instances = yourModelFactory.count(5).make();
console.log(instances); // Output: An array of 5 generated instances of your model
```

### Generate a Single Instance of Your Model with State Mutations (Partial Object)

You can generate a single instance of your model with specific state mutations using the `withState()` method:

```javascript
// Generate a single instance of your model with state mutations (partial object)
const instanceWithStatePartial = yourModelFactory
    .withState({ status: 'active', isAdmin: true })
    .make();
console.log(instanceWithStatePartial); // Output: The generated instance of your model with applied state mutations
```

### Generate an Instance of Your Model with Specific State Using Custom Method

You can generate a single instance of your model with specific state applied through a custom method:

```javascript
// Generate a single instance of your model with specific state using a custom method
const instanceWithAdminState = yourModelFactory
    .isAdmin()
    .make();
console.log(instanceWithAdminState); // Output: The generated instance of your model with isAdmin set to true
```

### Generate a Single Instance of Your Model with State Mutations (Function Returning Recent Faker Date)

You can also generate a single instance of your model with state mutations using a function returning a recent Faker date:

```javascript
// Generate a single instance of your model with state mutations (function returning recent Faker date)
const instanceWithStateFunction = yourModelFactory
    .withState(() => ({ createdAt: faker.date.recent() }))
    .make();
console.log(instanceWithStateFunction); // Output: The generated instance of your model with applied state mutations
```

In this updated example:

- We provide separate blocks for generating a single instance of your model, generating multiple instances of your model with count, generating a single instance of your model with state mutations (partial object), generating a single instance of your model with specific state using a custom method, and generating a single instance of your model with state mutations (function returning recent Faker date).
- The example usage with Faker and the API section remain unchanged.

You may need to adjust the import statements, variable names, and method implementations according to your project's specific details.

## API

### `BaseFactory<T>`

#### Methods

- `count(quantity: number): this`: Sets the quantity of instances to generate.
- `withState(state: Partial<T> | (() => Partial<T>)): this`: Adds state mutations to modify the generated data.
- `make(): T | T[]`: Generates instances without persisting them.
- `create(): Promise<T | T[]>`: Generates and persists instances to the database.

### Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request on GitHub.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
