import _ from "lodash"
import React from "react"
import { Autobind } from "babel-autobind"

@Autobind
class WebGLCanvas extends React.Component {
  static childContextTypes = {
    gl: React.PropTypes.object,
    canvas: React.PropTypes.object,
  }

  static propTypes = {
    shadersWillCompile: React.PropTypes.func,
    webGLDidMount: React.PropTypes.func,
  }

  static defaultProps = {
    shadersWillCompile: x => x,
    webGLDidMount: x => x,
  }

  constructor() {
    super();

    this.programInstances = []
    this.compiled_programs = {}
    this.glComponents = []
  }

  getProgramWithID(id) {
    return this.compiled_programs[id]
  }

  getChildContext() {
    return {
      gl: {
        context: () => this.gl,
        getProgramWithID: this.getProgramWithID,
        registerComponent: this.registerGLComponent,
        registerProgram: this.registerProgram,
      },
      canvas: { instance: () => this.canvas },
    }
  }

  registerProgram(name, program) {
    this.programInstances.push(program)
  }

  registerGLComponent(component) {
    this.glComponents.push(component)
  }

  shouldComponentUpdate() {
    return false;
  }

  compilePrograms() {
    // Fire our before compilation event
    this.props.shadersWillCompile(this.canvas, this.gl);

    // Compile the vertex/fragment shaders into programs
    const compiled_programs = _.filter(
      _.map(this.programInstances, (v) => {
        if (v == null) return;

        const program =  v.compileProgram(this.gl);
        _.merge(this.compiled_programs, program);
        return _.values(program)[0];
      })
    );

    // Use the first program by default
    const defaultProgram = compiled_programs[0]
    return defaultProgram;
  }

  componentDidMount() {
    this.canvas = this.refs.canvas;
    this.gl = this.canvas.getContext("webgl", {
      premultipliedAlpha: false
    });
    window.webglUtils.resizeCanvasToDisplaySize(this.gl.canvas);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clearColor(1, 1, 1, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendEquation(this.gl.FUNC_ADD);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.compilePrograms();



    // this.props.webGLDidMount(this.canvas, this.gl, program)
    // Run each GL component's webGLDidMount
    _.map(this.glComponents, instance => {
      const programId = instance.programId;
      const programInstance = this.compiled_programs[programId];

      this.gl.useProgram(programInstance);
      instance.webGLDidMount(this.canvas, this.gl, programInstance)
      instance.glRender(this.canvas, this.gl, instance.props)
    })
  }


  render() {
    return (
      <canvas
          id="mycanvas"
          ref="canvas"
      >
        {this.props.children}
      </canvas>
    );
  }
}

export default WebGLCanvas
