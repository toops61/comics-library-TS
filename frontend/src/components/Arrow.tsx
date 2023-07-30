export default function Arrow() {
    const scrollUp = () => {
    window.scrollTo({
        top:0,
        left:0,
        behavior: "smooth"
    });
    }
    return (
        <button type="button" aria-label="scroller" className="arrow-up" id="arrow-up" tabIndex={0} onClick={scrollUp}>
        </button>
    )
}