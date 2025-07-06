import * as React from "react"
import { Extension } from "@/lib/api"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ExtensionSelectorProps {
  extensions: Extension[]
  selectedExtension: string
  onSelectionChange: (extensionName: string) => void
  disabled?: boolean
}

export function ExtensionSelector({
  extensions,
  selectedExtension,
  onSelectionChange,
  disabled = false
}: ExtensionSelectorProps) {
  const selectedExtensionData = extensions.find(ext => ext.extensionName === selectedExtension)

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="extension-select" className="text-sm font-medium text-muted-foreground">
        Select Extension
      </label>
      <Select
        value={selectedExtension}
        onValueChange={onSelectionChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-[280px]" id="extension-select">
          <SelectValue>
            {selectedExtensionData?.displayName || selectedExtension}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {(extensions.slice().sort((a, b) => a.displayName.localeCompare(b.displayName))).map((extension) => (
            <SelectItem key={extension.extensionName} value={extension.extensionName}>
              <div className="flex flex-col">
                <span className="font-medium">{extension.displayName}</span>
                <span className="text-xs text-muted-foreground">{extension.extensionName}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
