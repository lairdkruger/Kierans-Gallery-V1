// global variables
var IMAGE_INDICES = {}
var CLICKED_ELEMENT = 0
var CURTAINS_SLIDESHOW = null
var CURTAINS_GRID = null
var FADE_OUT_DURATION = 1000

window.addEventListener('load', function() {
    CURTAINS_SLIDESHOW = new CurtainsGallery(
        morphShader.uniforms,
        morphShader.vertexShader,
        morphShader.fragmentShader
    )

    document.getElementById('slideshow-canvas').style.display = 'none'

    CURTAINS_GRID = new CurtainsGridScroller(
        scrollShader.uniforms,
        scrollShader.vertexShader,
        scrollShader.fragmentShader
    )

    // document.body.classList.add('no-curtains')

    handleClicks()
})

function handleClicks() {
    // home
    var back = document.getElementsByClassName('title-box')[0]
    back.addEventListener('click', function() {
        window.location = '/'
    })

    // grid image clicks
    var images = document.getElementsByClassName('grid-image')

    for (var i = 0; i < images.length; i++) {
        IMAGE_INDICES[images[i].src] = i

        images[i].addEventListener('click', function(event) {
            var target = event.target.src
            CLICKED_ELEMENT = IMAGE_INDICES[target]

            CURTAINS_SLIDESHOW.refreshIndex()

            document.getElementById('grid-canvas').style.display = 'none'
            document.getElementById('slideshow-canvas').style.display = 'block'
            document.getElementById('navigation').style.pointerEvents = 'all'
        })
    }

    // back click
    var back = document.getElementById('navigation-back')
    back.addEventListener('click', function() {
        document.getElementById('slideshow-canvas').style.display = 'none'
        document.getElementById('grid-canvas').style.display = 'block'
        document.getElementById('navigation').style.pointerEvents = 'none'
    })
}
