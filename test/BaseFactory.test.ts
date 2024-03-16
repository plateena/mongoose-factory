// Import the necessary modules and classes for testing
import { Model } from "mongoose"
import BaseFactory from "../src/BaseFactory"

// Mock Mongoose model schema
interface YourModelSchema {
    name: string
    email: string
    age: number
    status: string
    isAdmin: boolean
    createdAt: Date
}

// Mock Mongoose model
const YourModel: Model<YourModelSchema> = {
    create: jest.fn().mockImplementation((data) => Promise.resolve(data)),
    insertMany: jest.fn().mockImplementation((data) => Promise.resolve(data)),
} as unknown as Model<YourModelSchema>

// Mock implementation of faker for testing purposes
const faker = {
    person: {
        fullname: jest.fn().mockReturnValue("John Doe"),
    },
    internet: {
        email: jest.fn().mockReturnValue("john@example.com"),
    },
    number: {
        int: jest.fn().mockReturnValue(25),
    },
    helpers: {
        enumValue: jest.fn().mockReturnValue("active"),
    },
    datatype: {
        boolean: jest.fn().mockReturnValue(true),
    },
    date: {
        recent: jest.fn().mockReturnValue(new Date()),
    },
}

// Create a subclass of BaseFactory for testing
class YourModelFactory extends BaseFactory<YourModelSchema> {
    constructor() {
        super(YourModel)
    }

    async definition(): Promise<YourModelSchema> {
        return {
            name: faker.person.fullname(),
            email: faker.internet.email(),
            age: faker.number.int(),
            status: faker.helpers.enumValue(["active", "inactive"]),
            isAdmin: faker.datatype.boolean(),
            createdAt: faker.date.recent(),
        }
    }
}

// Write test cases using Jest
describe("BaseFactory", () => {
    let yourModelFactory: YourModelFactory

    beforeEach(() => {
        yourModelFactory = new YourModelFactory()
    })

    it("should generate a single instance without mutations", async () => {
        const instance = await yourModelFactory.make()
        expect(instance).toEqual({
            name: "John Doe",
            email: "john@example.com",
            age: 25,
            status: "active",
            isAdmin: true,
            createdAt: expect.any(Date),
        })
    })

    it("should generate multiple instances with count", async () => {
        const instances = (await yourModelFactory
            .count(3)
            .make()) as YourModelSchema[]
        expect(Array.isArray(instances)).toBeTruthy()
        expect(instances.length).toBe(3)
    })

    it("should generate a single instance with state mutations", async () => {
        const instanceWithState = await yourModelFactory
            .withState({ status: "inactive" })
            .make()
        expect(instanceWithState).toEqual({
            name: "John Doe",
            email: "john@example.com",
            age: 25,
            status: "inactive",
            isAdmin: true,
            createdAt: expect.any(Date),
        })
    })

    // Add more test cases as needed
})
