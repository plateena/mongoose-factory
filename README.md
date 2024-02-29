# Plateena Mongoose Factory

Plateena Mongoose Factory is a utility for generating and creating instances of Mongoose models with ease. It provides a flexible way to define and generate mock data for testing purposes or any other scenario where you need to create instances of Mongoose models.

## Installation

You can install Plateena Mongoose Factory via npm:

```bash
npm install plateena-mongoose-factory
```

## Usage

To use Plateena Mongoose Factory, you need to create a subclass of the `BaseFactory` class and implement the `definition()` method to define the structure of the data you want to generate.

Here's an example of how to use Plateena Mongoose Factory:

```typescript
import { Model } from 'mongoose';
import BaseFactory from 'plateena-mongoose-factory';

// Define your Mongoose model
interface UserModel {
    name: string;
    email: string;
}

// Create a concrete subclass of BaseFactory
class UserFactory extends BaseFactory<UserModel> {
    definition(): UserModel {
        return {
            name: 'John Doe',
            email: 'john@example.com',
        };
    }
}

// Mock Mongoose Model
class MockModel {
    static create(data: any) {
        return Promise.resolve(data);
    }
}

// Create an instance of UserFactory
const factory = new UserFactory(MockModel as unknown as Model<UserModel>);

// Generate and create instances
const user = factory.create();
console.log(user); // Output: { name: 'John Doe', email: 'john@example.com' }
```

## API

### `BaseFactory<T>`

#### Methods

- `count(quantity: number): this`: Sets the quantity of instances to generate.
- `withState(state: Partial<T> | (() => Partial<T>)): this`: Allows setting additional state for generated instances.
- `make(): T | T[]`: Generates instances without persisting them.
- `create(): Promise<T | T[]>`: Generates and persists instances to the database.

### Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request on GitHub.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```

Feel free to customize this README.md file according to your specific use case, adding more examples, usage guidelines, or additional sections as needed. Make sure to update placeholders like package name, installation command, and usage examples with your actual package details.
