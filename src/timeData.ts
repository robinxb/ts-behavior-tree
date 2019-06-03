/**
 * Delta time used by all nodes
 */
export class TimeData {
  deltaTime: number
  /**
   * Creates an instance of time data.
   * @param deltaTime Delta time
   */
  constructor(deltaTime: number = 1) {
    this.deltaTime = deltaTime
  }
}
