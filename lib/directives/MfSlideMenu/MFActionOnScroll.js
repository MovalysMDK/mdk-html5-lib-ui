angular.module('mfui').value('MFActionOnScroll',
{
    onScrollDown:null,
    onScrollUp:null,
    /**
     * Minimum of pixels to have at the bottom of the screen below the displayed area to continue the scroll
     */
    lengthThreshold:50,
    /**
     * Delay before calling the action
     */
    timeThreshold:400,

    htmlElement:null
});