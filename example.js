var foo;
// => undefined

var bar = foo;
foo = 'foo'; // bar == undefined
bar = 'bar'; // foo == 'foo'

foo = [];
bar = foo; // bar == []

foo.push(5); // bar == [5]
bar.pop();   // foo == []
