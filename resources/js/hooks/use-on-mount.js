import { useEffect } from "react";

export default function useOnMount(effect) {
    useEffect(effect, []);
}
