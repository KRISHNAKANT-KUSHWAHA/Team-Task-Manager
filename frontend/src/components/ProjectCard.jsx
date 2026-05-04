import { Users } from "lucide-react";

const ProjectCard = ({ project }) => {
  return (
    <article className="panel">
      <h3 className="text-base font-semibold text-slate-950">{project.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{project.description}</p>
      <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <Users size={17} />
        <span>{project.members?.length || 0} members</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {project.members?.slice(0, 5).map((member) => (
          <span key={member._id} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {member.name}
          </span>
        ))}
      </div>
    </article>
  );
};

export default ProjectCard;
