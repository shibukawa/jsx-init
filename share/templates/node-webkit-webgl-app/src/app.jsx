/**
 * {{& Name }}
 *
 * {{& description }}
 *
 * [sample] This comment is document for class. You can use some HTML tags.
 *
 * @author {{& author }}
 *
 * @see {{& homepage }}
 *
 * License: {{& licensename }}
 */

import "console.jsx";
import 'js/web.jsx';
import 'js/nodejs.jsx';
import 'node-webkit.jsx';

/**
 * Main code of node-webkit application.
 * You can use node-webkit API and Web API, node.js API together.
 */
class _Main {
    static function initShader(gl : WebGLRenderingContext) : void {
        var vertexShaderSource = '''
            precision mediump float;
            attribute vec2 vertex;
            void main() {
                gl_Position = vec4(vertex, 0.0, 1.0);
            }
        ''';

        var fragmentShaderSource = '''
            precision mediump float;
            void main() {
                gl_FragColor = vec4(1.0, 0.7, 0.8, 1.0);
            }
        ''';

        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);

        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);

        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.bindAttribLocation(shaderProgram, 0, 'vertex');
        gl.linkProgram(shaderProgram);

        gl.useProgram(shaderProgram);
    }

    static function initPrimitiveData(gl : WebGLRenderingContext) : void {
        var vertexData = [
            -0.8,-0.8, 0.3,-0.6, -0.6,0.3,
            0.3,-0.6, 0.2,0.7, -0.6,0.3,
            0.3,-0.6, 0.7,0.2, -0.6,0.3
        ];

        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);
    }

    static function main(args : string[]) : void {
        var canvas = dom.id('webgl-canvas') as HTMLCanvasElement;
        var gl = canvas.getContext('webgl') as WebGLRenderingContext;
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        _Main.initShader(gl);
        _Main.initPrimitiveData(gl);

        // Draw
        gl.drawArrays(gl.TRIANGLES, 0, 9);
    }
}
