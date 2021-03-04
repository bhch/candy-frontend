export default function Icon(props) {
    let className = "bi bi-" + props.name;

    if (props.className)
        className = className + ' ' + props.className;

    return <i className={className}></i>
}