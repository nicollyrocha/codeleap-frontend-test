import type { Post } from "../types/post";
import { calculateTimePassed } from "../../utils/calculateTimePassed";
import { Button } from "./button";
import { Heart, Loader2, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { Modal } from "./modal";
import { Input } from "./input";
import { TextArea } from "./text-area";

export const CardPost = ({
  post,
  handleDelete,
  handleEdit,
  loading,
  liked,
  onLike,
}: {
  post: Post;
  handleDelete: (id: number) => void;
  handleEdit: (id: number, title: string, content: string) => void;
  loading?: boolean;
  liked?: boolean;
  onLike?: (postId: number) => void;
}) => {
  const itsMe = post.username === (localStorage.getItem("username") || "User");
  const [isOpen, setIsOpen] = useState(false);
  const [deleteOrEdit, setDeleteOrEdit] = useState<"delete" | "edit">("delete");
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleHeartLike = () => {
    onLike?.(post.id);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className="rounded-lg md:w-188 w-full">
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {deleteOrEdit === "delete" ? (
          <div className="flex flex-col h-36.5 w-72 md:w-165 justify-between">
            <div className="text-[22px] font-bold">
              Are you sure you want to delete this item?
            </div>
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => setIsOpen(false)}
                text="Cancel"
                variant="secondary"
              />
              <Button
                onClick={() => {
                  handleDelete(post.id);
                  setIsOpen(false);
                }}
                text={loading ? <Loader2 className="animate-spin" /> : "Delete"}
                variant="danger"
                disabled={loading}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-83.5 w-72 md:w-165 justify-between">
            <div className="text-[22px] font-bold">Edit item</div>
            <Input
              onChange={(e) => setEditedTitle(e.target.value)}
              defaultValue={post.title}
              type="text"
              value={editedTitle}
              label="Title"
            />
            <TextArea
              label="Content"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <Button
                text="Cancel"
                onClick={() => setIsOpen(false)}
                variant="secondary"
              />
              <Button
                text={loading ? <Loader2 className="animate-spin" /> : "Save"}
                onClick={() => {
                  handleEdit(post.id, editedTitle, editedContent);
                  setIsOpen(false);
                }}
                disabled={loading || editedTitle === "" || editedContent === ""}
                variant="green"
              />
            </div>
          </div>
        )}
      </Modal>
      <div className="bg-[#7695EC] rounded-t-2xl text-white text-[22px] font-bold px-5 h-17.5 flex items-center">
        {post.title}
        <div className="flex gap-2 ml-auto">
          <Button
            type="icon"
            text={itsMe ? <SquarePen /> : ""}
            onClick={() => {
              setDeleteOrEdit("edit");
              setIsOpen(true);
            }}
          />
          <Button
            type="icon"
            text={itsMe ? <Trash2 /> : ""}
            onClick={() => {
              setDeleteOrEdit("delete");
              setIsOpen(true);
            }}
          />
        </div>
      </div>
      <div className="bg-white border border-l-[#999999] border-r-[#999999] border-b-[#999999] border-t-0 p-4 flex flex-col gap-2 rounded-b-2xl pt-6">
        <div className="flex justify-between">
          <div className="text-[#777777] font-bold text-[18px]">
            @{post.username}
          </div>
          <div className="text-[18px] text-[#777777]">
            {calculateTimePassed(post.created_datetime)}
          </div>
        </div>

        <div className="flex justify-between gap-2">
          <div className="text-[18px]">{post.content}</div>
          <Heart
            fill={liked ? "currentColor" : "none"}
            className={`cursor-pointer transition-colors ${liked ? "text-red-500" : "text-gray-500"} ${isAnimating ? "animate-heartBeat" : ""}`}
            onClick={handleHeartLike}
          />
        </div>
      </div>
    </div>
  );
};
