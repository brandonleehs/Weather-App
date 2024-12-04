export default class View {
  protected constructor() {
    if (this.constructor === View) {
      throw new Error('Abstract classes cannot be instantiated.');
    }
  }

  protected render(): void {
    throw new Error("Method 'render()' must be implemented.");
  }
}
