export type Listener<T> = {
    (event: T): void;
}
  
export type Disposable = {
    dispose();
}