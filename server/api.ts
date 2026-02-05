export const getPosts = async () => {
  const response = await fetch("https://dev.codeleap.co.uk/careers/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  return data;
};

export const createPost = async (
  username: string,
  title: string,
  content: string,
) => {
  const response = await fetch("https://dev.codeleap.co.uk/careers/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, title, content }),
  });
  const data = await response.json();
  return data;
};

export const updatePost = async (
  id: number,
  title: string,
  content: string,
) => {
  const response = await fetch(`https://dev.codeleap.co.uk/careers/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content }),
  });
  const data = await response.json();
  return data;
};

export const deletePost = async (id: number) => {
  const response = await fetch(`https://dev.codeleap.co.uk/careers/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.ok;
};
