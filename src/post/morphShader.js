var morphShader = {
    uniforms: {
        progress: {
            name: 'uProgress',
            type: '1f',
            value: 0,
        },
        state: {
            name: 'uState',
            type: '1f',
            value: 0,
        },
    },

    vertexShader: `
        #ifdef GL_ES
        precision mediump float;
        #endif
  
        // default mandatory attributes
        attribute vec3 aVertexPosition;
        attribute vec2 aTextureCoord;
    
        // those projection and model view matrices are generated by the library
        // it will position and size our plane based on its HTML element CSS values
        uniform mat4 uMVMatrix;
        uniform mat4 uPMatrix;
    
        // texture coord varying that will be passed to our fragment shader
        varying vec2 vTextureCoord;
    
        void main() {
            // apply our vertex position based on the projection and model view matrices
            gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    
            // varying
            // use texture matrix and original texture coords to generate accurate texture coords
            vTextureCoord = aTextureCoord;
        }
    `,

    fragmentShader: `
        #ifdef GL_ES
        precision mediump float;
        #endif

        // get our varyings
        varying vec3 vVertexPosition;
        varying vec2 vTextureCoord;


        uniform sampler2D imageTexture;
        uniform sampler2D fadeTexture;
        uniform float uProgress;
        uniform float uState;

        float strength = 0.1;
        vec4 fromColor;
        vec4 toColor;

        vec3 transition(vec2 uv) {
            float inv = 1.0 - uProgress;

            vec4 fromColor = texture2D(imageTexture, vTextureCoord);
            vec4 toColor = texture2D(fadeTexture, vTextureCoord);

            vec2 fromOffset = (((fromColor.rg + fromColor.b) * 0.5) * 2.0 - 1.0);
            vec2 toOffset = (((toColor.rg + toColor.b) * 0.5) * 2.0 - 1.0);
            vec2 offset = mix(fromOffset, toOffset, 0.5) * strength;

            // fade out
            if (uState == 1.0) {
                return mix(
                    texture2D(imageTexture, vTextureCoord - offset * uProgress).rgb, 
                    texture2D(fadeTexture, vTextureCoord + offset * inv).rgb, 
                    uProgress
                    );
            } 

            // fade in
            if (uState == 2.0) {
                return mix(
                    texture2D(fadeTexture, vTextureCoord - offset * uProgress).rgb, 
                    texture2D(imageTexture, vTextureCoord + offset * inv).rgb, 
                    uProgress
                    );
            }

            // start state
            if (uState == 3.0) {
                return vec3(texture2D(imageTexture, vTextureCoord).rgb);
            }
        }

        void main() {
            vec2 textureCoord = vTextureCoord;
            gl_FragColor = vec4(transition(textureCoord), 1.0);
        }
    `,
}