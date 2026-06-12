from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from api.middleware.auth import require_auth

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/builder", tags=["builder"])

fake_workflows: dict[str, dict[str, Any]] = {}


class CreateWorkflowRequest(BaseModel):
    name: str
    description: str = ""
    steps: list[dict[str, Any]] = []


class UpdateWorkflowRequest(BaseModel):
    name: str | None = None
    description: str | None = None
    steps: list[dict[str, Any]] | None = None


class ExecuteWorkflowRequest(BaseModel):
    inputs: dict[str, Any] = {}


@router.post("/workflows")
async def create_workflow(
    body: CreateWorkflowRequest,
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    wf_id = str(uuid4())
    now = datetime.now(timezone.utc).isoformat()
    fake_workflows[wf_id] = {
        "id": wf_id,
        "name": body.name,
        "description": body.description,
        "steps": body.steps,
        "user_id": user_id,
        "created_at": now,
        "updated_at": now,
    }
    logger.info("Workflow created: %s by %s", wf_id, user_id)
    return fake_workflows[wf_id]


@router.get("/workflows")
async def list_workflows(user_id: str = Depends(require_auth)) -> list[dict[str, Any]]:
    return [wf for wf in fake_workflows.values() if wf["user_id"] == user_id]


@router.get("/workflows/{wf_id}")
async def get_workflow(
    wf_id: str,
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    wf = fake_workflows.get(wf_id)
    if not wf or wf["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workflow not found")
    return wf


@router.put("/workflows/{wf_id}")
async def update_workflow(
    wf_id: str,
    body: UpdateWorkflowRequest,
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    wf = fake_workflows.get(wf_id)
    if not wf or wf["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workflow not found")
    if body.name is not None:
        wf["name"] = body.name
    if body.description is not None:
        wf["description"] = body.description
    if body.steps is not None:
        wf["steps"] = body.steps
    wf["updated_at"] = datetime.now(timezone.utc).isoformat()
    return wf

@router.delete("/workflows/{wf_id}")
async def delete_workflow(
    wf_id: str,
    user_id: str = Depends(require_auth),
) -> dict[str, str]:
    wf = fake_workflows.get(wf_id)
    if not wf or wf["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workflow not found")
    del fake_workflows[wf_id]
    return {"message": "Workflow deleted"}


@router.post("/workflows/{wf_id}/execute")
async def execute_workflow(
    wf_id: str,
    body: ExecuteWorkflowRequest,
    user_id: str = Depends(require_auth),
) -> dict[str, Any]:
    wf = fake_workflows.get(wf_id)
    if not wf or wf["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workflow not found")
    logger.info("Workflow executed: %s by %s", wf_id, user_id)
    return {
        "workflow_id": wf_id,
        "status": "completed",
        "outputs": {"result": "Placeholder workflow execution result"},
        "execution_time_ms": 1234,
    }
