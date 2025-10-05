import { Button } from "@/components/ui/button"
import React from "react"
import { ClassNameValue, twMerge } from "tailwind-merge"
import { LucideIcon } from "lucide-react"

interface IButtonRounded {
  IIcon?: LucideIcon;
  className?: ClassNameValue;
  title?: string;
  textStyle?: ClassNameValue; 
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link" | null | undefined ;
  size?: "default" | "icon" | "sm" | "lg" | "icon-sm" | "icon-lg" | null | undefined;
  onClick?: () => void;
}

export function CustomButton({
  IIcon,
  className,
  title,
  textStyle = "",
  variant = "default",
  size = "icon",
  onClick = () => console.log('Button Clicked 💥')
}: IButtonRounded) {
  return (
    <Button variant={variant} size={size} className={twMerge("bg-[#323232] flex justify-center items-center",className)} onClick={onClick}>
      { title ? <h1 className={twMerge(textStyle)}>{title}</h1> : null }
      { IIcon ? <IIcon /> : null }
    </Button>
  )
}