function init() {
    resetScroll();
    // disable scrolling
    window.addEventListener( 'scroll', noscroll );
    // set current page trigger
    classie.add( pageTriggers[ current ], 'thumb-nav__item--current' );
    // set current container
    classie.add( containers[ current ], 'container--current' );
    // initialize events

//    imagesLoaded(body, { background: true }, function() {
    // Create the image pieces.
        var pm = new PieceMaker(document.querySelector('.pieces'));
        // Start the squares loop effect on the main image.
//        pm.loopFx();
        // Split the title, contact and code menu items into spans/letters.
//        wordsToLetters();
        // Init/Bind events
//        initEvents();
//    });

    initEvents(pm);
};

function initEvents(pm) {
    // slideshow navigation
    pageTriggers.forEach( function( pageTrigger ) {
        pageTrigger.addEventListener( 'click', function( ev ) {
            ev.preventDefault();
            navigate( this );
        });
    });

    // open each container's content area when clicking on the respective trigger button
    containers.forEach( function( container ) {
        container.querySelector( 'button.trigger' ).addEventListener( 'click', function() {
            toggleContent( container, this );
        });
    });

    // keyboard navigation events
    document.addEventListener( 'keydown', function( ev ) {
        var keyCode = ev.keyCode || ev.which,
            isContainerOpen = containers[ current ].getAttribute( 'data-open' ) == 'open';

        switch (keyCode) {
            // left key
            case 37:
              if( current > 0 && !isContainerOpen ) {
                navigate( pageTriggers[ current - 1 ] );
              }
            break;
            // right key
            case 39:
              if( current < containersCount - 1 && !isContainerOpen ) {
                navigate( pageTriggers[ current + 1 ] );
            }
            break;
        }
    });

    switchModeCtrls.design.addEventListener('click', switchMode);
    switchModeCtrls.code.addEventListener('click', switchMode);

    const pauseFxFn = function() {
            pm.stopLoopFx();
            pm.removeTilt();
          },
          playFxFn = function() {
            pm.loopFx();
            pm.initTilt();
          },
          contactMouseEnterEvFn = function(ev) {
            if( isAnimating ) return false;
            if( mode === 'design' ) {
                pauseFxFn();
            }
            pm.fxCustom(mode === 'design' ? 'left' : 'right');
          },
          contactMouseLeaveEvFn = function(ev) {
            if( isAnimating || !pm.fxCustomTriggered ) return false;
            pm.fxCustomReset(mode === 'design' ? 'left' : 'right', function() {
                if( !disablePageFx ) {
                    playFxFn();
                }
            });
          },
          switchMouseEnterEvFn = function(ev) {
            if( disablePageFx || isAnimating ) return;
            pauseFxFn();
          },
          switchMouseLeaveEvFn = function(ev) {
            if( disablePageFx || isAnimating ) return;
            playFxFn();
          };

    contact.el.addEventListener('mouseenter', contactMouseEnterEvFn);
    contact.el.addEventListener('mouseleave', contactMouseLeaveEvFn);
    switchCtrls.addEventListener('mouseenter', switchMouseEnterEvFn);
    switchCtrls.addEventListener('mouseleave', switchMouseLeaveEvFn);

};

function navigate( pageTrigger ) {
    var oldcurrent = current,
        newcurrent = pageTriggers.indexOf( pageTrigger );

    if( isAnimating || oldcurrent === newcurrent ) return;
    isAnimating = true;

    // reset scroll
    allowScroll();
    resetScroll();
    preventScroll();

    var currentPageTrigger = pageTriggers[ current ],
        nextContainer = document.getElementById( pageTrigger.getAttribute( 'data-container' ) ),
        currentContainer = containers[ current ],
        dir = newcurrent > oldcurrent ? 'left' : 'right';

    classie.remove( currentPageTrigger, 'thumb-nav__item--current' );
    classie.add( pageTrigger, 'thumb-nav__item--current' );

    // update current
    current = newcurrent;

    // add animation classes
    classie.add( nextContainer, dir === 'left' ? 'container--animInRight' : 'container--animInLeft' );
    classie.add( currentContainer, dir === 'left' ? 'container--animOutLeft' : 'container--animOutRight' );

    onEndAnimation( currentContainer, function() {
        // clear animation classes
        classie.remove( currentContainer, dir === 'left' ? 'container--animOutLeft' : 'container--animOutRight' );
        classie.remove( nextContainer, dir === 'left' ? 'container--animInRight' : 'container--animInLeft' );

        // clear current class / set current class
        classie.remove( currentContainer, 'container--current' );
        classie.add( nextContainer, 'container--current' );

        isAnimating = false;
    });
};

// show content section
function toggleContent( container, trigger ) {
    if( classie.has( container, 'container--open' ) ) {
        classie.remove( container, 'container--open' );
        classie.remove( trigger, 'trigger--active' );
        classie.remove( nav, 'thumb-nav--hide' );
        container.setAttribute( 'data-open', '' );
        preventScroll();
    } else {
        classie.add( container, 'container--open' );
        classie.add( trigger, 'trigger--active' );
        classie.add( nav, 'thumb-nav--hide' );
        container.setAttribute( 'data-open', 'open' );
        allowScroll();
    }
};

// scroll functions
function resetScroll() { document.body.scrollTop = document.documentElement.scrollTop = 0; }
function preventScroll() { window.addEventListener( 'scroll', noscroll ); }
function allowScroll() { window.removeEventListener( 'scroll', noscroll ); }
function noscroll() { window.scrollTo( 0, 0 ); }

