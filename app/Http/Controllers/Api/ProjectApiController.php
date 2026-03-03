<?php
namespace App\Http\Controllers\Api;

use App\Http\Requests\ProjectStoreRequest;
use App\Http\Requests\ProjectUpdateRequest;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectApiController extends Controller
{
    /**
     * Display a listing of the projects.
     *
     * @return JsonResponse
     */
    public function index(Request $request)
    {
        $projects = Project::paginate($request->input('per_page', 10));

        return response()->json($projects);
    }

    /**
     * Store a newly created project in storage.
     *
     * @param  ProjectStoreRequest  $request
     * @return JsonResponse
     */
    public function store(ProjectStoreRequest $request)
    {
        $project = Project::create($request->validated());

        return response()->json($project, 201);
    }

    /**
     * Display the specified project.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function show($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        return response()->json($project);
    }

    /**
     * Update the specified project in storage.
     *
     * @param  ProjectUpdateRequest  $request
     * @param  int  $id
     * @return JsonResponse
     */
    public function update(ProjectUpdateRequest $request, $id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $project->update($request->validated());

        return response()->json($project);
    }

    /**
     * Remove the specified project from storage.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully']);
    }
}