import Link from "next/link";

export default function EventCard({event:
    { name, _id }, index}) {
  return (
    <div className={`mx-auto flex p-2 py-3 gap-3 rounded ${index === 0 ? 'border-t' : ''} border-b items-center justify-between`}>
            <span className="text-sm font-bold truncate" title={name}>{name}</span>
            <a href={`/event/manage/${_id}`}>
                <button className="bg-white text-blue-500 border border-blue-500 rounded-full p-2 py-1">Manage</button>
            </a>
    </div>

  )
}
