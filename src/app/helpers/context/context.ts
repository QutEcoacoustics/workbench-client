// an implementation of the web components context's proposal
// https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/context.md

/**
 * A context key.
 *
 * A context key can be any type of object, including strings and symbols. The
 *  Context type brands the key type with the `__context__` property that
 * carries the type of the value the context references.
 */
export type Context<KeyType, ValueType> = KeyType & { __context__: ValueType };

/**
 * An unknown context type
 */
export type UnknownContext = Context<unknown, unknown>;

/**
 * A helper type which can extract a Context value type from a Context type
 */
export type ContextType<T extends UnknownContext> = T extends Context<
  infer _,
  infer V
>
  ? V
  : never;

/**
 * A function which creates a Context value object
 */
export const createContext = <ValueType>(key: unknown) =>
  key as Context<typeof key, ValueType>;

/**
 * A callback which is provided by a context requester and is called with the value satisfying the request.
 * This callback can be called multiple times by context providers as the requested value is changed.
 */
export type ContextCallback<ValueType> = (
  value: ValueType,
  unsubscribe?: () => void
) => void;

export class ContextRequestEvent<T extends UnknownContext> extends Event {
  public constructor(
    context: T,
    callback: ContextCallback<ContextType<T>>,
    subscribe: boolean = false
  ) {
    super("context-request", { bubbles: true, composed: true });
    this.context = context;
    this.callback = callback;
    this.subscribe = subscribe;
  }

  public readonly context: T;
  public readonly callback: ContextCallback<ContextType<T>>;
  public readonly subscribe: boolean;
}
