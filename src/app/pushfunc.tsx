'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/router"

type Variant = 'link' | 'outline' | 'ghost' | null | 'default' | 'destructive' | 'secondary';
type Size = 'default' | 'sm' | 'lg';


export default function GoBtn(props : {path: string, className: string, variant?: Variant, children: React.ReactNode, size?: Size}) {
    const router = useRouter()

    if (!router.isReady) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Button 
             size={props.size}
              variant={props.variant}
              className={props.className}  
              onClick={() => router.push(props.path)}
            >{props.children}</Button>
        </div>
    )
}