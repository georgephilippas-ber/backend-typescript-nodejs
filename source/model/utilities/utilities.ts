type boundary_type = "minimum" | "maximum" | "both";

export function isBetween(number_: number, minimum: number, maximum: number, inclusive: boundary_type = "both")
{
    let criteria: boolean[] = [];

    if (["minimum", "both"].includes(inclusive))
        criteria.push(number_ >= minimum);
    else
        criteria.push(number_ > minimum);

    if (["maximum", "both"].includes(inclusive))
        criteria.push(number_ <= maximum);
    else
        criteria.push(number_ < maximum);

    return criteria.every(value => value);
}

export function exclude(object_: object, exclude_properties_: string[]): any
{
    let transformed_: any = {};

    for (let property_ in object_)
        if (!exclude_properties_.includes(property_))
            transformed_[property_] = property_;

    return transformed_;
}
