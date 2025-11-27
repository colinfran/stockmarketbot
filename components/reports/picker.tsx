import { FC } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useData } from "@/providers/data-provider"

type PickerType = {
  selectedReportId: undefined | string
  setSelectedReportId: (id: string) => void
}

const Picker: FC<PickerType> = ({ selectedReportId, setSelectedReportId }) => {
  const { reports } = useData()
  return (
    <div className="w-full md:w-[280px] py-6">
      <Select value={selectedReportId} onValueChange={setSelectedReportId}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select report" />
        </SelectTrigger>
        <SelectContent>
          {reports.map((report) => (
            <SelectItem key={report.id} value={report.id}>
              {"Friday "}
              {new Date(report.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default Picker
