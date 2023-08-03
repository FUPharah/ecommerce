"use client"
import { useState, useEffect } from "react";
import { Button } from "./button";
import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}
const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, [])

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }


  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[400px] h-[300px] rounded-lg
            overflow-hidden border-4 border-black hover:border-lime-500 shadow-md shadow-slate-500
            hover:shadow-lime-400">
            <div className="z-10 absolute top-2 right-2">
              <Button className="bg-gradient-to-r border-2 border-red-300 hover:border-red-900
              from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4
              focus:outline-none focus:ring-red-300 dark:focus:ring-red-800
              shadow-lg shadow-red-500/50 dark:shadow-lg
              dark:shadow-red-800/80"
              type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                <Trash2 className="h-4 w-4 hover:text-black"/>
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url}/>
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="csryolsi">
        {({ open }) => {
          const onClick = () => {
            open();
          }
          return (
            <Button className="bg-slate-400 border-2 border-slate-500 shadow-md shadow-slate-500 hover:shadow-slate-400 hover:bg-slate-300 hover:border-slate-400" type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className=" text-violet-700 h-5 w-5 mr-2"/>
              <span className="font-bold text-black hover:text-white">Upload an Image</span>
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
