import { Button } from '@/components/ui/button'
import { LucideCloudUpload } from 'lucide-react'

const MeetingCard = () => {
  return (
    <div className="col-span-1 border-1 rounded-lg">
      <Button className="cursor-pointer">
        <LucideCloudUpload className="size-5 text-teal-900 " />
        Upload Meeting
      </Button>
    </div>
  )
}

export default MeetingCard
