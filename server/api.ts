import { supabase } from "./supabaseClient";

export const getPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_datetime", { ascending: false });

  if (error) throw new Error(error.message);

  return { results: data };
};

export const createPost = async (
  username: string,
  title: string,
  content: string,
) => {
  const { data, error } = await supabase
    .from("posts")
    .insert({ username, title, content })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const updatePost = async (
  id: number,
  title: string,
  content: string,
) => {
  const { data, error } = await supabase
    .from("posts")
    .update({ title, content })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const deletePost = async (id: number) => {
  const { error } = await supabase.from("posts").delete().eq("id", id);

  return !error;
};
