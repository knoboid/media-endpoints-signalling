import { createReceiver, createTransmitter } from "../create-client.js";

describe("create-receiver.js", () => {
  test("createReceiver", () => {
    const r1 = createReceiver("ws1");
    const r2 = createReceiver("ws2");
    expect(r1.getWebSocket()).toBe("ws1");
    expect(r2.getWebSocket()).toBe("ws2");
    expect(r1.getClientType()).toBe("receiver");
    expect(r2.getClientType()).toBe("receiver");
    expect(r1.isReceiver()).toBeTruthy();
    expect(r2.isReceiver()).toBeTruthy();
    expect(r1.isTransmitter()).toBeFalsy();
    expect(r2.isTransmitter()).toBeFalsy();
    expect(r1.getId()).not.toBe(r2.getId());
  });

  test("createTransmitter", () => {
    const r1 = createTransmitter("ws1");
    const r2 = createTransmitter("ws2");
    expect(r1.getWebSocket()).toBe("ws1");
    expect(r2.getWebSocket()).toBe("ws2");
    expect(r1.getClientType()).toBe("transmitter");
    expect(r2.getClientType()).toBe("transmitter");
    expect(r1.isReceiver()).toBeFalsy();
    expect(r2.isReceiver()).toBeFalsy();
    expect(r1.isTransmitter()).toBeTruthy();
    expect(r2.isTransmitter()).toBeTruthy();
    expect(r1.getId()).not.toBe(r2.getId());
  });
});
