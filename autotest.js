(function(Autotest) {

  Autotest.Example = function Example(steps) {
    this.steps = steps;
  };

  /**
   * Parses the body of a code example and produces an array comprising some
   * strings (code to run) and some {@link Assertion} objects.
   *
   * @param {string} text
   * @returns {Autotest.Example}
   */
  Autotest.Example.parse = function parseExample(text) {
    var lines = text.split('\n'),
        steps = [];

    lines.forEach(function(line, lineNumber) {
      var assertion = Autotest.Assertion.parse(line);

      if (assertion) {
        assertion.actual || (assertion.actual = steps.pop());
        assertion.lineNumber = lineNumber;
        steps.push(assertion);

      } else {
        steps.push(line);
      }
    });

    return new Autotest.Example(steps);
  };

  Autotest.Assertion = function Assertion(type, actual, expected) {
    this.type     = type;
    this.actual   = actual;
    this.expected = expected;
  };

  Autotest.Assertion.MATCHERS = [
    {
      pattern: /^={1,3}>?\s*(.*)$/,
      type: 'equality'
    },
    {
      pattern: /^(\w[\w\d]*)\s*==\s*(.*)$/,
      type: 'externalEquality',
      data: function(match) {
        return {
          actual: match[1],
          expected: match[2]
        };
      }
    }
  ];

  Autotest.Assertion.parse = function parseAssertion(text) {
    var matchers = Autotest.Assertion.MATCHERS,
        parts    = text.split(),
        matcher, left, right, match, data;

    for (var i = 0; i < matchers.length; ++i) {
      parts = split(text);
      right = parts.pop();
      left  = parts[0];

      matcher = matchers[i];
      match   = right.match(matcher.pattern);

      if (match) {
        data = matcher.data ? matcher.data(match) : {
          actual: left,
          expected: match[1]
        };

        return new Autotest.Assertion(matcher.type, data.actual, data.expected);
      }
    }
  };

  function split(string) {
    var splitPoint = string.indexOf('//');

    if (splitPoint === -1) {
      return [trim(string)];
    }

    return [
      trim(string.substring(0, splitPoint)),
      trim(string.substring(splitPoint + 2))
    ];
  }

  function trim(string) {
    return string.replace(/^\s*|\s*$/g, '');
  }

}(typeof module === 'object' ? (module.exports = {}) : (this.Autotest = {})));
