export default class PayloadEvent extends Event {
  constructor(name, data) {
    super(name);
    this.data = data;
  }
}
