
export default function Container({children, w_class}){
    return (
    <div className={`${w_class || "max-w-screen-md"} mx-auto`}>
        {children}
    </div>
    )
}