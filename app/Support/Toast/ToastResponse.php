<?php

namespace App\Support\Toast;

use Inertia\Inertia;

trait ToastResponse
{
    public function success(string $message): void
    {
        Inertia::flash('toast', ['type' => 'success', 'message' => $message]);
    }

    public function error(string $message): void
    {
        Inertia::flash('toast', ['type' => 'error', 'message' => $message]);
    }

    public function executeWithToast(callable $action, string $successMessage, string $errorMessage): mixed
    {
        try {
            $result = $action();

            $this->success($successMessage);

            return $result;
        } catch (\Throwable $e) {
            $this->error($errorMessage);

            report($e);

            return null;
        }
    }
}
