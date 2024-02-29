import { Model } from 'mongoose';
import BaseFactory from '../src/BaseFactory';

class TestFactory extends BaseFactory<any> {
    definition(): any {
        return {};
    }
}

class MockModel {
    static create(data: any) {
        return Promise.resolve(data);
    }

    static async insertMany(data: any[]) {
        // Mock implementation of insertMany
        // You can customize this implementation based on your needs
        return Promise.resolve(data);
    }
}

describe('BaseFactory', () => {
    let factory: TestFactory;

    beforeEach(() => {
        factory = new TestFactory(MockModel as unknown as Model<any>);
    });

    it('should generate a single instance', () => {
        const instance = factory.count(1).make();
        expect(instance).toBeDefined();
    });

    it('should generate multiple instances', () => {
        const instances = factory.count(3).make();
        expect(Array.isArray(instances)).toBeTruthy();
        expect(instances.length).toBe(3);
    });

    it('should create a single instance', async () => {
        const instance = await factory.count(1).create();
        expect(instance).toBeDefined();
    });

    it('should create multiple instances', async () => {
        const instances = await factory.count(3).create();
        expect(Array.isArray(instances)).toBeTruthy();
        expect(instances.length).toBe(3);
    });
});
