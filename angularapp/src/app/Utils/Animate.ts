export default function AnimateElement (Element : HTMLElement, From : any, To : any, Duration : number, Direction : PlaybackDirection = 'normal', Timing : string = 'linear') {
    const Animation = Element.animate([ From, To], {
        duration: Duration,
        iterations: 1,
        fill: 'forwards',
        direction: Direction,
        easing: Timing
    });
    return Animation;
}