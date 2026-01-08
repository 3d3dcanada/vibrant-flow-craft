import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useState, useCallback } from "react";

export interface MaterialOption {
    id: string;
    name: string;
    shortName: string;
    pricePerGram: number;
    description: string;
    properties: string[];
    popular?: boolean;
}

const MATERIALS: MaterialOption[] = [
    {
        id: 'PLA_STANDARD',
        name: 'PLA Standard',
        shortName: 'PLA',
        pricePerGram: 0.09,
        description: 'Great for prototypes and decorative parts',
        properties: ['Easy to print', 'Biodegradable', 'Low warp'],
        popular: true,
    },
    {
        id: 'PLA_SPECIALTY',
        name: 'PLA Specialty',
        shortName: 'PLA+',
        pricePerGram: 0.14,
        description: 'Enhanced strength and heat resistance',
        properties: ['Stronger', 'Heat resistant', 'Premium finish'],
    },
    {
        id: 'PETG',
        name: 'PETG',
        shortName: 'PETG',
        pricePerGram: 0.11,
        description: 'Durable and chemical resistant',
        properties: ['Strong', 'Flexible', 'Water resistant'],
        popular: true,
    },
    {
        id: 'PETG_CF',
        name: 'PETG Carbon Fiber',
        shortName: 'CF',
        pricePerGram: 0.35,
        description: 'Carbon fiber reinforced for high strength',
        properties: ['Ultra strong', 'Lightweight', 'Professional'],
    },
    {
        id: 'TPU',
        name: 'TPU Flexible',
        shortName: 'TPU',
        pricePerGram: 0.18,
        description: 'Rubber-like flexibility',
        properties: ['Flexible', 'Impact resistant', 'Durable'],
    },
    {
        id: 'ABS_ASA',
        name: 'ABS/ASA',
        shortName: 'ABS',
        pricePerGram: 0.13,
        description: 'High temperature and UV resistant',
        properties: ['Heat resistant', 'UV stable', 'Industrial'],
    },
];

interface MaterialCarouselProps {
    selectedMaterial: string;
    onSelect: (materialId: string) => void;
    className?: string;
}

export function MaterialCarousel({ selectedMaterial, onSelect, className }: MaterialCarouselProps) {
    const [startIndex, setStartIndex] = useState(0);
    const visibleCount = 3;

    const canScrollLeft = startIndex > 0;
    const canScrollRight = startIndex + visibleCount < MATERIALS.length;

    const scrollLeft = useCallback(() => {
        if (canScrollLeft) setStartIndex(prev => prev - 1);
    }, [canScrollLeft]);

    const scrollRight = useCallback(() => {
        if (canScrollRight) setStartIndex(prev => prev + 1);
    }, [canScrollRight]);

    const visibleMaterials = MATERIALS.slice(startIndex, startIndex + visibleCount);

    return (
        <div className={cn("space-y-4", className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-tech font-semibold text-lg text-foreground">
                    Select Material
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={scrollLeft}
                        disabled={!canScrollLeft}
                        className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            "transition-all duration-200",
                            canScrollLeft
                                ? "bg-secondary/10 text-secondary hover:bg-secondary/20"
                                : "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                        aria-label="Previous materials"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={scrollRight}
                        disabled={!canScrollRight}
                        className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            "transition-all duration-200",
                            canScrollRight
                                ? "bg-secondary/10 text-secondary hover:bg-secondary/20"
                                : "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                        aria-label="Next materials"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Carousel */}
            <div className="grid grid-cols-3 gap-3">
                {visibleMaterials.map((material) => {
                    const isSelected = selectedMaterial === material.id;

                    return (
                        <button
                            key={material.id}
                            onClick={() => onSelect(material.id)}
                            className={cn(
                                "relative p-4 rounded-lg text-left transition-all duration-200",
                                "glass-panel hover:border-secondary/40",
                                isSelected && "border-2 border-secondary shadow-glow-sm"
                            )}
                        >
                            {/* Popular badge */}
                            {material.popular && (
                                <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-tech bg-primary text-primary-foreground rounded-full">
                                    Popular
                                </span>
                            )}

                            {/* Selected checkmark */}
                            {isSelected && (
                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                                    <Check className="w-3 h-3 text-secondary-foreground" />
                                </div>
                            )}

                            {/* Content */}
                            <div className="space-y-2">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-tech font-bold text-lg text-foreground">
                                        {material.shortName}
                                    </span>
                                    <span className="text-xs text-secondary">
                                        ${material.pricePerGram}/g
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {material.description}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {material.properties.slice(0, 2).map((prop) => (
                                        <span
                                            key={prop}
                                            className="px-1.5 py-0.5 text-[10px] font-tech bg-muted rounded text-muted-foreground"
                                        >
                                            {prop}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Pagination dots */}
            <div className="flex justify-center gap-1.5">
                {Array.from({ length: MATERIALS.length - visibleCount + 1 }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setStartIndex(i)}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all duration-200",
                            startIndex === i
                                ? "bg-secondary w-4"
                                : "bg-muted hover:bg-secondary/50"
                        )}
                        aria-label={`Go to page ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

export { MATERIALS };
