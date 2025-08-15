export function Navigation({ editor, shown, navi_bar_width }) {
    return (
        editor &&
        shown && <div className="absolute top-0 left-0 bottom-0 border-r border-[#ddd]" style={{ width: `${navi_bar_width}px` }}></div>
    );
}
