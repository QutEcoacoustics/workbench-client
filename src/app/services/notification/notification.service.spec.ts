import { TestBed } from "@angular/core/testing";
import { NotificationService } from "./notification.service";

describe("NotificationService", () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(NotificationService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should handle success alert", () => {
    service.success("testing message");
    expect(service["alerts"]).toEqual([
      {
        type: "success",
        message: "testing message"
      }
    ]);
  });

  it("should handle warning alert", () => {
    service.warning("testing message");
    expect(service["alerts"]).toEqual([
      {
        type: "warning",
        message: "testing message"
      }
    ]);
  });

  it("should handle danger alert", () => {
    service.danger("testing message");
    expect(service["alerts"]).toEqual([
      {
        type: "danger",
        message: "testing message"
      }
    ]);
  });

  it("should handle multiple alerts", () => {
    service.success("testing message");
    service.warning("testing message");
    service.danger("testing message");
    expect(service["alerts"]).toEqual([
      {
        type: "success",
        message: "testing message"
      },
      {
        type: "warning",
        message: "testing message"
      },
      {
        type: "danger",
        message: "testing message"
      }
    ]);
  });

  it("should handle clearAlert with zero index", () => {
    service.success("testing message");
    service.warning("testing message");
    service.danger("testing message");
    service.clearAlert(0);
    expect(service["alerts"]).toEqual([
      {
        type: "warning",
        message: "testing message"
      },
      {
        type: "danger",
        message: "testing message"
      }
    ]);
  });

  it("should handle clearAlert", () => {
    service.success("testing message");
    service.warning("testing message");
    service.danger("testing message");
    service.clearAlert(1);
    expect(service["alerts"]).toEqual([
      {
        type: "success",
        message: "testing message"
      },
      {
        type: "danger",
        message: "testing message"
      }
    ]);
  });

  it("should handle clearAlert with max index", () => {
    service.success("testing message");
    service.warning("testing message");
    service.danger("testing message");
    service.clearAlert(2);
    expect(service["alerts"]).toEqual([
      {
        type: "success",
        message: "testing message"
      },
      {
        type: "warning",
        message: "testing message"
      }
    ]);
  });

  it("should handle clearAlert with out of bounds index", () => {
    service.success("testing message 1");
    service.warning("testing message 2");
    service.danger("testing message 3");
    service.clearAlert(3);
    expect(service["alerts"]).toEqual([
      {
        type: "success",
        message: "testing message 1"
      },
      {
        type: "warning",
        message: "testing message 2"
      },
      {
        type: "danger",
        message: "testing message 3"
      }
    ]);
  });

  it("should handle clearAlert with empty alerts", () => {
    service.clearAlert(0);
    expect(service["alerts"]).toEqual([]);
  });

  it("should get trigger", done => {
    expect(service.getTrigger()).toBeTruthy();

    // tslint:disable-next-line: rxjs-no-ignored-error
    service.getTrigger().subscribe(alerts => {
      expect(alerts).toBeTruthy();
      expect(alerts).toEqual([]);
      done();
    });
  });

  it("should update trigger on success alert", done => {
    let count = 0;

    // tslint:disable-next-line: rxjs-no-ignored-error
    service.getTrigger().subscribe(alerts => {
      if (count === 0) {
        count++;
      } else {
        expect(alerts).toBeTruthy();
        expect(alerts).toEqual([
          {
            type: "success",
            message: "testing message"
          }
        ]);
        done();
      }
    });

    service.success("testing message");
  });

  it("should update trigger on warning alert", done => {
    let count = 0;

    // tslint:disable-next-line: rxjs-no-ignored-error
    service.getTrigger().subscribe(alerts => {
      if (count === 0) {
        count++;
      } else {
        expect(alerts).toBeTruthy();
        expect(alerts).toEqual([
          {
            type: "warning",
            message: "testing message"
          }
        ]);
        done();
      }
    });

    service.warning("testing message");
  });

  it("should update trigger on danger alert", done => {
    let count = 0;

    // tslint:disable-next-line: rxjs-no-ignored-error
    service.getTrigger().subscribe(alerts => {
      if (count === 0) {
        count++;
      } else {
        expect(alerts).toBeTruthy();
        expect(alerts).toEqual([
          {
            type: "danger",
            message: "testing message"
          }
        ]);
        done();
      }
    });

    service.danger("testing message");
  });

  it("should update trigger with multiple alerts", done => {
    let count = 0;

    // tslint:disable-next-line: rxjs-no-ignored-error
    service.getTrigger().subscribe(alerts => {
      if (count === 1) {
        expect(alerts).toEqual([
          {
            type: "success",
            message: "testing message 1"
          }
        ]);
      } else if (count === 2) {
        expect(alerts).toEqual([
          {
            type: "success",
            message: "testing message 1"
          },
          {
            type: "warning",
            message: "testing message 2"
          }
        ]);
      } else if (count === 3) {
        expect(alerts).toEqual([
          {
            type: "success",
            message: "testing message 1"
          },
          {
            type: "warning",
            message: "testing message 2"
          },
          {
            type: "danger",
            message: "testing message 3"
          }
        ]);

        done();
      }

      count++;
    });

    service.success("testing message 1");
    service.warning("testing message 2");
    service.danger("testing message 3");
  });

  it("should update trigger on clearAlert", done => {
    let count = 0;

    // tslint:disable-next-line: rxjs-no-ignored-error
    service.getTrigger().subscribe(alerts => {
      if (count === 1) {
        expect(alerts).toEqual([
          {
            type: "success",
            message: "testing message 1"
          }
        ]);
      } else if (count === 2) {
        expect(alerts).toEqual([]);
        done();
      }

      count++;
    });

    service.success("testing message 1");
    service.clearAlert(0);
  });

  it("should update trigger on multiple clearAlert", done => {
    let count = 0;

    // tslint:disable-next-line: rxjs-no-ignored-error
    service.getTrigger().subscribe(alerts => {
      if (count === 1) {
        expect(alerts).toEqual([
          {
            type: "success",
            message: "testing message 1"
          }
        ]);
      } else if (count === 2) {
        expect(alerts).toEqual([
          {
            type: "success",
            message: "testing message 1"
          },
          {
            type: "warning",
            message: "testing message 2"
          }
        ]);
      } else if (count === 3) {
        expect(alerts).toEqual([
          {
            type: "warning",
            message: "testing message 2"
          }
        ]);
      } else if (count === 4) {
        expect(alerts).toEqual([]);
        done();
      }

      count++;
    });

    service.success("testing message 1");
    service.warning("testing message 2");
    service.clearAlert(0);
    service.clearAlert(0);
  });
});
