<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;

class DocumentSearchController extends Controller
{
    public function __invoke(Request $request)
    {
        $query = Document::query()
            ->with(['category', 'documentable'])
            ->when($request->search, function (Builder $query, string $search) {
                $query->where(function (Builder $query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('file_name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereJsonContains('tags', $search);
                });
            })
            ->when($request->category, function (Builder $query, $category) {
                if ($category !== 'all') {
                    $query->where('category_id', $category);
                }
            })
            ->when($request->type, function (Builder $query, $type) {
                if ($type !== 'all') {
                    $query->where('file_type', $type);
                }
            })
            ->when($request->date_from, function (Builder $query, $date) {
                $query->whereDate('created_at', '>=', $date);
            })
            ->when($request->date_to, function (Builder $query, $date) {
                $query->whereDate('created_at', '<=', $date);
            })
            ->when($request->size_min, function (Builder $query, $size) {
                $query->where('file_size', '>=', $size);
            })
            ->when($request->size_max, function (Builder $query, $size) {
                $query->where('file_size', '<=', $size);
            })
            ->when($request->tags, function (Builder $query, array $tags) {
                foreach ($tags as $tag) {
                    $query->whereJsonContains('tags', $tag);
                }
            });

        return $query->orderBy($request->sort_by ?? 'created_at', $request->sort_direction ?? 'desc')
            ->paginate($request->per_page ?? 20)
            ->withQueryString();
    }
} 