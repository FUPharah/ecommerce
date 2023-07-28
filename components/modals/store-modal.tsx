"use client"

import { useStoreModal } from "@/hooks/use-store-modal"
import { Modal } from "../ui/modal"

export const StoreModal = () => {
  const storeModal = useStoreModal();
  return (
    <Modal title="Create a store" description="Create a new store to manage"
    isOpen={storeModal.isOpen} onClose={storeModal.onClose}>
      Create store form inc
    </Modal>
  );
}
