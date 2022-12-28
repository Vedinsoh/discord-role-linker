var IntegerTypes;
(function (IntegerTypes) {
    /**
     * Number is less than or equal to the guild's configured value
     */
    IntegerTypes[IntegerTypes["LessThanOrEqual"] = 1] = "LessThanOrEqual";
    /**
     * Number is greater than or equal to the guild's configured value
     */
    IntegerTypes[IntegerTypes["GreaterThanOrEqual"] = 2] = "GreaterThanOrEqual";
    /**
     * Number is equal to the guild's configured value
     */
    IntegerTypes[IntegerTypes["Equal"] = 3] = "Equal";
    /**
     * Number is not equal to the guild's configured value
     */
    IntegerTypes[IntegerTypes["NotEqual"] = 4] = "NotEqual";
})(IntegerTypes || (IntegerTypes = {}));
var DateTimeTypes;
(function (DateTimeTypes) {
    /**
     * Date (ISO8601 string) is less than or equal to the guild's configured value (days before current date)
     */
    DateTimeTypes[DateTimeTypes["LessThanOrEqual"] = 5] = "LessThanOrEqual";
    /**
     * Date (ISO8601 string) is greater than or equal to the guild's configured value (days before current date)
     */
    DateTimeTypes[DateTimeTypes["GreaterThanOrEqual"] = 6] = "GreaterThanOrEqual";
})(DateTimeTypes || (DateTimeTypes = {}));
var BooleanTypes;
(function (BooleanTypes) {
    /**
     * Boolean is equal to the guild's configured value
     */
    BooleanTypes[BooleanTypes["Equal"] = 7] = "Equal";
    /**
     * Boolean is not equal to the guild's configured value
     */
    BooleanTypes[BooleanTypes["NotEqual"] = 8] = "NotEqual";
})(BooleanTypes || (BooleanTypes = {}));
export const ValueTypes = {
    Integer: IntegerTypes,
    Number: IntegerTypes,
    DateTime: DateTimeTypes,
    Boolean: BooleanTypes,
};
//# sourceMappingURL=ValueTypes.js.map