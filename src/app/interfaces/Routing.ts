


// function functionGenerator<T extends string, U = { [K in T]?: string }>(keys: T[]): (p: U) => U {
//     return (p: U) => p;
// }
// function pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
//     return propertyNames.map(n => o[n]);
// }

// const myArray = ["foo", "bar"] as const;
// type MyArray = typeof myArray[number];

// type ArgumentTypes<T> = T extends (... args: infer U ) => infer R ? U: never;
// function Route<S extends string, T extends S[], K extends T[number], U extends (...args: infer K ? U: never) => string>(keys: T): [U, string] {
//     return [null, null];
// }

// let route = ["a", "b", "c"] as const;

// // function Route(...components: string[]) {

// // }
// const testFun = functionGenerator(["a", "b", "c"]);



// let [a, b] = Route(route)