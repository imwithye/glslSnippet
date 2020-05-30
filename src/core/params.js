class ParseError {
  constructor(lineno, name, errMsg) {
    this.lineno = lineno;
    this.errMsg = `Param '${name}' parse error: ${errMsg}`;
  }
}

class SizeParam {
  constructor(lineno, code) {
    this.width = '250px';
    this.height = '250px';
    this.heightAsRatio = false;

    const chunks = code
      .split(' ')
      .map((chunk) => chunk.trim())
      .filter((chunk) => chunk.length > 0);
    if (chunks.length == 0) {
      return;
    } else if (chunks.length == 1) {
      this.width = chunks[0];
      this.height = chunks[0];
      this.heightAsRatio = false;
    } else if (chunks.length == 2) {
      this.width = chunks[0];
      this.height = chunks[1];
      this.heightAsRatio = false;

      if (/^\d+:\d+$/g.test(chunks[1])) {
        const numbers = chunks[1].match(/\d+/g);
        this.height = (1 / numbers[0]) * numbers[1];
        this.heightAsRatio = true;
      }
    }
  }

  apply(canvas) {
    canvas.element.style.width = this.width;
    if (!this.heightAsRatio) {
      canvas.element.style.height = this.height;
      canvas.element.style.height = `${canvas.element.clientHeight + 64}px`;
    } else {
      canvas.element.style.height = `${
        this.height * canvas.element.clientWidth
      }px`;
      canvas.element.style.height = `${canvas.element.clientHeight + 64}px`;
    }
  }
}

class ParamParser {
  apply(canvas, fragCode) {
    const regex = /^\/\/\s*\+[a-zA-Z_]+[a-zA-Z_0-9-]*\s*\:/;
    const paramTokens = fragCode
      .split('\n')
      .map((line, idx) => ({ lineno: idx, code: line.trim() }))
      .filter((line) => regex.test(line.code))
      .map((line) => {
        const name = line.code
          .match(regex)[0]
          .match(/\+[a-zA-Z_]+[a-zA-Z0-9_\-]*/)[0];
        const code = line.code.replace(regex, '').trim();
        return { name, code, lineno: line.lineno };
      });
    const params = [];
    const errors = [];
    for (let i = 0; i < paramTokens.length; i++) {
      const paramToken = paramTokens[i];
      try {
        if (paramToken.name == '+Size') {
          const sizeParam = new SizeParam(paramToken.lineno, paramToken.code);
          sizeParam.apply(canvas);
        }
      } catch (e) {
        errors.push(e);
      }
    }
    return { params, errors };
  }
}

module.exports = { ParamParser };
