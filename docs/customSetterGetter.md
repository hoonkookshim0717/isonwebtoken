set() function of mwt instance can take 3 types of arguments.

1. Function, which returns an object with 'setter' or 'getter' function, or both.
2. Object, which have property 'setter' or 'getter', or both.
3. String & object, 1st string arguments designates the name of the property, and object with 'setter' or 'getter', or both.

Each key(an element of token) have its own setter/getter function pair.

setter functions from every keys are executed during sign() to insert token element to the token under construction,
and getter function is executed during verify() to pass the value to the object under construction, or to interpret or evaluate the value extracted from the token.

If no setter/getter function is specified, then default setter/getter function is set to the every properties of the payload.

Default setter looks like this. very simple.
```js
function defaultSetter(value) { return value; }
```
setter gets the value(probably from the value of the property of the src object), and the return value is to be encoded to token string and added to the token under construction.

Default getter looks like this. Also very simple.
```js
function defaultGetter(value, target) { if(typeof this.keyName === 'string') target[this.keyName) = value;
```
* value: data extracted from the token.
* target: the object under construction.
* this.keyName: Might be the name of the property the value is for. Or a symbol. It means this is a meta key, which doesn't go into the resulting object and just doing some evaluation.

default getter function received an value from the token for a property, and sets it to the 

