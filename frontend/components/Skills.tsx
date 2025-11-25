import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";

export default function SkillsSelector({ value = [], onChange }) {
  const [skills, setSkills] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [page] = useState(1);
  const limit = 10;

  const { accessToken, user } = useAppSelector((state) => state.auth);
  const fetchSkills = async (search = "") => {
    try {
      const res = await api.get(
        `/skills?page=${page}&limit=${limit}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = res.data;
      setSkills(data?.data || []);
      return data?.data || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    fetchSkills(query).then((list) => {
      setSuggestions(
        list.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
      );
    });
  }, [query]);

  const addSkill = async (s) => {
    try {
      await api.post(
        "/workers/skills",
        {
          skill_id: s.id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!value.includes(s.name) && !value.includes(s.id)) {
        onChange([...value, { id: s.id, name: s.name }]);
      }
      toast.success("Skills Added");
    } catch (err) {
      toast.error("Fail to add skill");
      console.error("Failed to add worker skill", err);
    }

    setQuery("");
    setSuggestions([]);
  };

  const removeSkill = async (skillName) => {
    try {
      const skill = skills.find((x) => x.id === skillName);
      if (skill) {
        await api.delete(`/workers/skills/${skill?.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
      toast.success("Skill removed");
      onChange(value.filter((x) => x.id !== skillName));
    } catch (err) {
      toast.error("failed to remove skill");
      console.error("Failed to remove worker skill", err);
    }
  };

  const createAndAddSkill = async (name) => {
    try {
      const res = await api.post(
        "/skills",
        { skill_name: name },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const newSkill = res.data?.data;

      if (!newSkill) throw new Error("Skill creation failed");

      await api.post(
        "/workers/skills",
        { skill_id: newSkill.id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      onChange([...value, { id: newSkill.id, name: newSkill.skill_name }]);
    } catch (err) {
      console.error("Failed to create new skill", err);
    }

    setQuery("");
    setSuggestions([]);
  };

  const handleEnter = () => {
    if (!query.trim()) return;

    // Jika suggestion ada → pilih suggestion pertama
    if (suggestions.length > 0) {
      addSkill(suggestions[0]);
      return;
    }

    // Jika tidak ada suggestion → create skill baru
    createAndAddSkill(query.trim());
  };
  return (
    <div className="mt-8">
      <h4 className="font-semibold mb-2">Skills </h4>

      <div className="relative">
        <Input
          placeholder="Search or add your skills..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleEnter();
            }
          }}
        />

        {suggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border bg-card shadow">
            {suggestions.map((s) => (
              <button
                key={s.id}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-accent"
                onClick={() => addSkill(s)}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {value.map((s) => (
          <span
            key={s.id}
            className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm"
          >
            {s.name}
            <Button
              size="icon"
              variant="ghost"
              className="h-5 w-5 rounded-full p-0 hover:bg-accent"
              onClick={() => removeSkill(s.id)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </span>
        ))}

        {!value.length && (
          <span className="text-sm text-muted-foreground">
            No skills added.
          </span>
        )}
      </div>
    </div>
  );
}
