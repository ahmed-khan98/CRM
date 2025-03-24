import Image from "next/image";
import blogImg1 from '../../Assets/blog-img1.png'
import blogImg2 from '../../Assets/blog-img2.png'
import blogImg3 from '../../Assets/blog-img3.png'

const blogData = [
  {
    id: 1,
    title: "A Phone Keeps Your Friends Away",
    description: "Bring to the table win-win survival strategies to ensure...",
    image: blogImg3,
  },
  {
    id: 2,
    title: "Chromebook Tab 10 review",
    description: "Bring to the table win-win survival strategies to ensure...",
    image: blogImg1,
  },
  {
    id: 3,
    title: "VR Boxes Sales for Black Friday",
    description: "Bring to the table win-win survival strategies to ensure...",
    image: blogImg2,
  },
];

export default function BlogSection() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogData.map((post) => (
          <div key={post.id} className="flex items-center space-x-4 group cursor-pointer w-full sm:w-[350px] lg:w-[400px]">
            <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
              <Image src={post.image} alt={post.title} layout="fill" objectFit="cover" className="rounded-md" />
            </div>
            <div>
              <h3 className="text-md sm:text-lg font-semibold group-hover:text-[#F33E0A] transition duration-300">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600">{post.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
