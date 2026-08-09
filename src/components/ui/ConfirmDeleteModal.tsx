import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  itemType?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  itemName,
  itemType = 'record',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#141312] border border-red-500/40 rounded-3xl p-6 sm:p-7 text-[#FDFBF7] shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        {/* Top Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 text-[#D8C8B8] hover:bg-white/10 hover:text-white transition-all cursor-pointer border border-white/10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon Badge */}
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0 shadow-lg">
            <AlertTriangle className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 block">
              Confirm Permanent Deletion
            </span>
            <h3 className="font-serif text-xl font-bold text-white leading-tight">{title}</h3>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1">
          <span className="text-[#8C7A6B] block uppercase tracking-wider text-[10px] font-semibold">Target {itemType}:</span>
          <p className="text-white font-semibold font-mono truncate">{itemName}</p>
          <p className="text-[#D8C8B8] text-[11px] pt-1">
            This action cannot be undone. The entry will be permanently removed from active archives and database records.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-lg shadow-red-900/30 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Permanently</span>
          </button>
        </div>
      </div>
    </div>
  );
};
