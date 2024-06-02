// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const Card = props => {
    return (
        <div className='bg-slate-50 rounded-lg h-36 flex flex-col p-3'>
            {props.children}
        </div>
    )
}

export default Card