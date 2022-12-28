enum IntegerTypes {
  /**
   * Number is less than or equal to the guild's configured value
   */
  LessThanOrEqual = 1,
  /**
   * Number is greater than or equal to the guild's configured value
   */
  GreaterThanOrEqual = 2,
  /**
   * Number is equal to the guild's configured value
   */
  Equal = 3,
  /**
   * Number is not equal to the guild's configured value
   */
  NotEqual = 4,
}

enum DateTimeTypes {
  /**
   * Date (ISO8601 string) is less than or equal to the guild's configured value (days before current date)
   */
  LessThanOrEqual = 5,
  /**
   * Date (ISO8601 string) is greater than or equal to the guild's configured value (days before current date)
   */
  GreaterThanOrEqual = 6,
}

enum BooleanTypes {
  /**
   * Boolean is equal to the guild's configured value
   */
  Equal = 7,
  /**
   * Boolean is not equal to the guild's configured value
   */
  NotEqual = 8,
}

export const ValueTypes = {
  Integer: IntegerTypes,
  Number: IntegerTypes,
  DateTime: DateTimeTypes,
  Boolean: BooleanTypes,
};
