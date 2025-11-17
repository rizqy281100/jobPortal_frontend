"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import api from "@/lib/axiosLogged";
import { useAppSelector } from "@/store/hooks";

export default function TagsInput({ value = [], onChange }: any) {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const { accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const controller = new AbortController();
    const fetchTags = async () => {
      try {
        const nameParam = query?.trim() || "_"; // biar ga kosong

        const res = await api.get(`/tags/all/${nameParam}`, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const list = res?.data?.data;

        console.log("Fetched tags:", list);

        // kalau list bukan array (null, undefined, object, dsb) → fallback []
        setTags(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Error fetching tags:", err);
        setTags([]); // fallback supaya tidak error di UI
      }
    };

    const timeout = setTimeout(fetchTags, 300); // debounce

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  const addTag = async (name: string) => {
    try {
      const res = await api.post(
        "/tags",
        { name },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // console.log("Added tag:", res.data);
      onChange([...value, res.data.data]);
      setQuery("");
      setTags([...tags, res.data]); // update daftar
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTag = (tag: any) => {
    const exists = value.find((v: any) => v.id === tag.id);
    if (exists) {
      onChange(value.filter((v: any) => v.id !== tag.id));
    } else {
      onChange([...value, tag]);
    }
  };

  return (
    <div className="w-full">
      <label className="text-sm font-medium mb-1 block">Tags</label>

      {/* Selected tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag: any) => (
          <Badge key={tag.id} variant="outline" className="flex gap-1">
            {tag.name}
            <span
              className="cursor-pointer"
              onClick={() =>
                onChange(value.filter((v: any) => v.id !== tag.id))
              }
            >
              ✕
            </span>
          </Badge>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {value.length > 0 ? `${value.length} selected` : "Select tags"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[300px] p-3">
          <Input
            placeholder="Search or add new..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="mt-2 max-h-[200px] overflow-y-auto">
            {/* List tags dari API */}
            {tags.map((tag) => {
              const selected = value.some((v: any) => v.id === tag.id);
              return (
                <div
                  key={tag.id}
                  onClick={() => toggleTag(tag)}
                  className={`p-2 rounded cursor-pointer hover:bg-accent ${
                    selected ? "bg-accent" : ""
                  }`}
                >
                  {tag.name}
                </div>
              );
            })}

            {/* Add new tag */}
            {query && tags.length === 0 && (
              <Button className="w-full mt-2" onClick={() => addTag(query)}>
                Add &quot;{query}&quot;
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
